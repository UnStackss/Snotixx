const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skipto',
    description: 'Skip to a specific track in the queue',
    voiceChannel: true,
    options: [
        {
            name: 'track_number',
            description: 'The position of the track in the queue you want to skip to',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to ensure the interaction is acknowledged

        const queue = useQueue(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        const trackNumber = inter.options.getNumber('track_number');
        if (trackNumber <= 0 || trackNumber > queue.tracks.length) {
            return await inter.editReply({ content: await Translate(`Invalid track number <${inter.member}>... try a number between 1 and ${queue.tracks.length} <❌>`) });
        }

        try {
            queue.node.skipTo(trackNumber - 1); // Skip to the specified track

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({
                    name: await Translate('Skipped to track'),
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
                })
                .setDescription(await Translate(`Skipped to track number **${trackNumber}** <✅>`))
                .setTimestamp()
                .setFooter({
                    text: await Translate('Enjoy the music!'),
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error while skipping to a track:', error);
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`An error occurred while skipping to the track <${inter.member}>... try again ? <❌>`) });
            }
        }
    }
};
