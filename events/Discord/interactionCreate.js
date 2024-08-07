const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async (client, inter) => {
    try {
        if (inter.deferred || inter.replied) return; // Non rispondere se già risposto o deferito

        if (inter.type === InteractionType.ApplicationCommand) {
            const DJ = client.config.opt.DJ;
            const command = client.commands.get(inter.commandName);

            const errorEmbed = new EmbedBuilder().setColor('#1E90FF');

            if (!command) {
                errorEmbed.setDescription(await Translate('<❌> | Error! Please contact Developers!'));
                return await inter.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (command.permissions && !inter.member.permissions.has(command.permissions)) {
                errorEmbed.setDescription(await Translate(`<❌> | You do not have the proper permissions to execute this command`));
                return await inter.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
                errorEmbed.setDescription(await Translate(`<❌> | This command is reserved for members with <\`${DJ.roleName}\`>`));
                return await inter.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (command.voiceChannel) {
                if (!inter.member.voice.channel) {
                    errorEmbed.setDescription(await Translate(`<❌> | You are not in a Voice Channel`));
                    return await inter.reply({ embeds: [errorEmbed], ephemeral: true });
                }

                if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                    errorEmbed.setDescription(await Translate(`<❌> | You are not in the same Voice Channel`));
                    return await inter.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            }

            // Esegui il comando
            await command.execute({ inter, client });
        } else if (inter.type === InteractionType.MessageComponent) {
            const customId = inter.customId;
            if (!customId) return;

            const queue = useQueue(inter.guild);
            const path = `../../buttons/${customId}.js`;

            delete require.cache[require.resolve(path)];
            const button = require(path);
            if (button) return await button({ client, inter, customId, queue });
        }
    } catch (error) {
        console.error('❌ Error handling interaction:', error);
        if (!inter.replied) {
            await inter.reply({ content: 'There was an error while processing this interaction!', ephemeral: true });
        }
    }
};
