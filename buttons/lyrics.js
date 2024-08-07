const { EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    try {
        // Assicurati che l'interazione sia deferita se non è già stata risposto
        if (!inter.replied) await inter.deferReply(); 

        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        const player = useMainPlayer();
        const results = await player.lyrics.search({ q: queue.currentTrack.title });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) {
            return await inter.editReply({ content: await Translate(`No lyrics found for <${queue.currentTrack.title}>... try again ? <❌>`) });
        }

        const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

        const embed = new EmbedBuilder()
            .setTitle(`Lyrics for ${queue.currentTrack.title}`)
            .setAuthor({ name: lyrics.artistName })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setFooter({ text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
            .setTimestamp()
            .setColor('#2f3136');

        return await inter.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('❌ Error handling interaction:', error);

        // Gestisci eventuali errori
        if (!inter.replied) await inter.deferReply();
        return await inter.editReply({ content: await Translate('There was an error while processing your request. Please try again later. <❌>') });
    }
};
