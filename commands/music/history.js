const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'history',
    description: 'See the history of the queue',
    voiceChannel: false,

    async execute({ inter }) {
        await inter.deferReply(); // Differisci la risposta

        const queue = useQueue(inter.guild);

        if (!queue || queue.history.tracks.toArray().length === 0) {
            return inter.editReply({ content: await Translate(`No music has been played yet <${inter.member}>... try again? <❌>`) });
        }

        const tracks = queue.history.tracks.toArray();

        let description = tracks
            .slice(0, 20) // Mostra solo le ultime 20 tracce
            .map((track, index) => `**${index + 1}.** [${track.title}](${track.url}) by ${track.author}`)
            .join('\n\n'); // Utilizza \n\n per una migliore leggibilità

        const historyEmbed = new EmbedBuilder()
            .setTitle(await Translate('History'))
            .setDescription(description || await Translate('No history available'))
            .setColor('#2f3136')
            .setTimestamp()
            .setFooter({
                text: await Translate('Music comes first - Made with heart by UnStackss <❤️>'),
                iconURL: inter.member.avatarURL({ dynamic: true })
            });

        return inter.editReply({ embeds: [historyEmbed] });
    }
};
