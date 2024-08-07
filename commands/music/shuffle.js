const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the current queue',
    voiceChannel: true,

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to ensure the interaction is acknowledged

        const queue = useQueue(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        if (queue.tracks.length === 0) {
            return await inter.editReply({ content: await Translate(`The queue is currently empty. Nothing to shuffle! <❌>`) });
        }

        try {
            // Shuffle the queue
            queue.tracks.shuffle();

            // Create and send the success embed
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: await Translate('Queue Shuffled'),
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                })
                .setDescription(await Translate(`The queue has been shuffled successfully <✅>`))
                .setTimestamp()
                .setFooter({
                    text: await Translate('Enjoy the new order of songs!'),
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error while shuffling the queue:', error);
            // If the interaction has not been replied to yet, send an error message
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`An error occurred while shuffling the queue <${inter.member}>... try again ? <❌>`) });
            }
        }
    }
};
