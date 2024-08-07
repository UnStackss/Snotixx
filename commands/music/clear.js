const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'clear',
    description: 'Clear all the music in the queue',
    voiceChannel: true,

    async execute({ inter }) {
        // Differisci la risposta per evitare errori di stato
        await inter.deferReply({ ephemeral: true });

        const queue = useQueue(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        if (queue.tracks.size === 0) {
            return inter.editReply({ content: await Translate(`No music in the queue to clear <${inter.member}>... try again ? <❌>`) });
        }

        try {
            queue.tracks.clear();

            const clearEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`The queue has just been cleared <🗑️>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [clearEmbed] });
        } catch (error) {
            console.log(`Clear error: ${error}`);
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`There was an error clearing the queue <❌>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [errorEmbed] });
        }
    }
}
