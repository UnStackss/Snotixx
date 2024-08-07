const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    try {
        // Definisci una risposta immediata
        await inter.deferReply(); // Deferisci la risposta se l'elaborazione richiede tempo

        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        // Crea l'embed con le informazioni della traccia corrente
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`🎵 Now Playing: ${queue.currentTrack.title}`)
            .setDescription(`**Title**: ${queue.currentTrack.title}\n**Artist**: ${queue.currentTrack.author}`)
            .addFields([
                { name: '⏱️ Duration', value: queue.currentTrack.duration, inline: true },
                { name: '👀 Views', value: queue.currentTrack.views ? queue.currentTrack.views.toLocaleString() : 'Not available', inline: true },  // Placeholder for views if available
                { name: '🔗 Song URL', value: `${queue.currentTrack.url}`, inline: false },
            ])
            .setThumbnail(queue.currentTrack.thumbnail || 'https://via.placeholder.com/150') // Aggiungi un URL di fallback per le miniature
            .setTimestamp()
            .setFooter({
                text: await Translate(`From the server ${inter.guild.name} 🎧`),
                iconURL: inter.guild.iconURL({ dynamic: true })
            });

        // Invia l'embed in un DM all'utente che ha interagito
        const user = await inter.user.send({ embeds: [embed] });

        // Modifica la risposta deferred per confermare che il DM è stato inviato
        await inter.editReply({ content: await Translate(`I've sent you the current track details in a private message! 🎶`) });
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply(); // Assicurati che `deferReply` venga chiamato se non è già stata inviata una risposta
        await inter.editReply({ content: await Translate(`There was an error processing your request. Please try again later. <❌>`) });
    }
};
