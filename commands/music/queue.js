const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'queue',
    description: 'Get the songs in the queue',
    voiceChannel: true,

    async execute({ client, inter }) {
        // Rispondi subito per evitare errori di stato
        await inter.deferReply({ ephemeral: true });

        const queue = useQueue(inter.guild);

        if (!queue) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }
        if (!queue.tracks.toArray()[0]) {
            return inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });
        }

        const methods = ['', '🔁', '🔂'];
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? await Translate(`And <**${songs - 5}**> other song(s)...`) : await Translate(`In the playlist <**${songs}**> song(s)...`);
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by: ${track.requestedBy ? track.requestedBy.displayName : "unknown"})`);

        // Troncamento della descrizione se necessario
        const description = await Translate(`Current <${queue.currentTrack.title}> <\n\n> <${tracks.slice(0, 5).join('\n')}> <\n\n> <${nextSongs}>`);
        const truncatedDescription = description.length > 2048 ? description.substring(0, 2045) + '...' : description;

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({ name: await Translate(`Server queue - <${inter.guild.name}> <${methods[queue.repeatMode]}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(truncatedDescription)
            .setTimestamp()
            .setFooter({ text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ embeds: [embed] });
    }
}
