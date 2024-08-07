const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    try {
        // Assicurati che l'interazione sia deferita se non è già stata risposto
        if (!inter.replied) await inter.deferReply();

        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        const track = queue.currentTrack;
        const methods = ['disabled', 'track', 'queue'];
        const timestamp = track.duration;
        const trackDuration = timestamp === 'Infinity' ? 'infinity (live)' : track.duration; // Corretta la condizione per 'Infinity'
        const progress = queue.node.createProgressBar(); // Assume che questa funzione sia corretta e restituisca una stringa

        const embed = new EmbedBuilder()
            .setAuthor({
                name: track.title,
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })
            })
            .setThumbnail(track.thumbnail)
            .setDescription(await Translate(`Volume: **${queue.node.volume}%**\nDuration: **${trackDuration}**\nProgress: ${progress}\nLoop mode: **${methods[queue.repeatMode]}**\nRequested by: ${track.requestedBy}`))
            .setFooter({
                text: 'Music comes first - Made with heart by Zerio ❤️',
                iconURL: inter.member.avatarURL({ dynamic: true })
            })
            .setColor('#1E90FF') // Usato un colore hex corretto per Discord
            .setTimestamp();

        await inter.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('❌ Error handling interaction:', error);

        // Gestisci eventuali errori
        if (!inter.replied) await inter.deferReply();
        return await inter.editReply({ content: await Translate('There was an error while processing your request. Please try again later. <❌>') });
    }
};
