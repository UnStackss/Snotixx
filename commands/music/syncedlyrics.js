const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'syncedlyrics',
    description: 'Get the synced lyrics for the currently playing track',
    voiceChannel: true,

    async execute({ client, inter }) {
        await inter.deferReply(); // Defer the reply to ensure the interaction is acknowledged

        const queue = useQueue(inter.guild);
        if (!queue || !queue.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        try {
            // Check if syncedLyrics is available
            if (!queue.node.syncedLyrics) {
                return await inter.editReply({ content: await Translate(`Synced lyrics are not available for this track <${inter.member}> <❌>`) });
            }

            const lyrics = await queue.node.syncedLyrics();

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('Synced Lyrics')
                .setDescription(lyrics)
                .setTimestamp()
                .setFooter({
                    text: await Translate('Enjoy the lyrics!'),
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error while retrieving synced lyrics:', error);
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`An error occurred while retrieving synced lyrics <${inter.member}>... try again ? <❌>`) });
            }
        }
    }
};
