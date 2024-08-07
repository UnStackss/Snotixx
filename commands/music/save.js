const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'save',
    description: 'Saves the currently playing track and sends the details in a DM',
    voiceChannel: true,

    async execute({ inter }) {
        try {
            // Differire la risposta per dare tempo di preparare il messaggio
            await inter.deferReply();

            const queue = useQueue(inter.guild);
            if (!queue || !queue.currentTrack) {
                await inter.editReply({ content: await Translate(`No track is currently playing <${inter.member}>... try again ? <❌>`) });
                return;
            }

            // Ottieni l'utente che ha inviato il comando
            const user = inter.user;

            // Crea l'embed con le informazioni della canzone
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

            // Invia il messaggio in DM all'utente
            await user.send({ embeds: [embed] });

            // Rispondi al comando con un messaggio di conferma
            await inter.editReply({ content: await Translate(`I've sent you the current track details in a private message! 🎶`) });

        } catch (error) {
            console.error('Error executing save command:', error);
            if (!inter.replied) {
                await inter.editReply({ content: await Translate(`There was an error trying to execute this command. Please try again later. <❌>`) });
            }
        }
    }
};
