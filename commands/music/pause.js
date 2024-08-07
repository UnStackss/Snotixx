const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'pause',
    description: 'Pause the currently playing track',
    voiceChannel: true,

    async execute({ client, inter }) {
        try {
            // Differire la risposta per dare tempo di preparare il messaggio
            await inter.deferReply();

            const queue = useQueue(inter.guild);
            if (!queue?.isPlaying()) {
                await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
                return;
            }

            // Pause the current track
            queue.node.pause();

            // Create an embed message for the reply
            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle('Track Paused')
                .setDescription('The currently playing track has been paused.')
                .setTimestamp()
                .setFooter({
                    text: 'Snotix - Crafted with care by UnStackss <3',
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                });

            // Send the reply with the embed
            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing pause command:', error);
            // If the interaction has not been replied yet, send an error message
            if (!inter.replied) {
                await inter.editReply({ content: 'There was an error trying to execute this command. Please try again later.' });
            }
        }
    },
};
