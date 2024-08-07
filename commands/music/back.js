const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'back',
    description: 'Go back to the last song played',
    voiceChannel: true,

    async execute({ inter }) {
        // Rispondi subito per evitare errori di stato
        await inter.deferReply({ ephemeral: true });

        const queue = useQueue(inter.guild);

        if (!queue || !queue.isPlaying()) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        if (!queue.history || !queue.history.previousTrack) {
            return inter.editReply({ content: await Translate(`There was no music played before <${inter.member}>... try again ? <❌>`) });
        }

        try {
            await queue.history.back();

            const backEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`Playing the previous track <✅>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [backEmbed] });
        } catch (error) {
            console.log(`Back error: ${error}`);
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: await Translate(`There was an error going back to the previous track <❌>`) })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [errorEmbed] });
        }
    }
}
