const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'volume',
    description: 'Adjust the volume of the player',
    voiceChannel: true,
    options: [
        {
            name: 'level',
            description: 'The volume level to set (1-100)',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to acknowledge the interaction

        const queue = useQueue(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        const level = inter.options.getNumber('level');
        if (level < 1 || level > 100) {
            return await inter.editReply({ content: await Translate(`Volume level must be between 1 and 100 <${inter.member}>... try again ? <❌>`) });
        }

        try {
            queue.node.setVolume(level); // Adjust the volume level

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: await Translate('Volume Adjusted'),
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                })
                .setDescription(await Translate(`Volume has been set to **${level}** <✅>`))
                .setTimestamp()
                .setFooter({
                    text: await Translate('Enjoy the music!'),
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error while adjusting the volume:', error);
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`An error occurred while adjusting the volume <${inter.member}>... try again ? <❌>`) });
            }
        }
    }
};
