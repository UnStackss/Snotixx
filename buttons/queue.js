const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    try {
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        const tracks = queue.tracks.toArray(); // Converti la coda in un array
        if (tracks.length === 0) {
            return await inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });
        }

        const methods = ['', '🔁', '🔂'];
        const songsCount = tracks.length;
        const nextSongs = songsCount > 5 
            ? await Translate(`And <**${songsCount - 5}**> other song(s)...`) 
            : await Translate(`In the playlist <**${songsCount}**> song(s)...`);

        // Costruisci la descrizione delle tracce
        const trackDescriptions = await Promise.all(tracks.slice(0, 5).map(async (track, i) => 
            await Translate(`<**${i + 1}**> - <${track.title} | ${track.author}> (requested by : <${track.requestedBy ? track.requestedBy.displayName : "unknown"}>)`)
        ));

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({
                name: await Translate(`Server queue - <${inter.guild.name} ${methods[queue.repeatMode]}>`),
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
            })
            .setDescription(`Current: ${queue.currentTrack.title}\n\n${trackDescriptions.join('\n')}\n\n${nextSongs}`)
            .setTimestamp()
            .setFooter({
                text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'),
                iconURL: inter.member.avatarURL({ dynamic: true })
            });

        await inter.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('❌ Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply();
        return await inter.editReply({ content: await Translate('There was an error while processing your request. Please try again later. <❌>') });
    }
};
