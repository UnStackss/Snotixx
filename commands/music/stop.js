const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'stop',
    description: 'Stop the track',
    voiceChannel: true,

    async execute({ inter }) {
        await inter.deferReply(); // Defer the reply to indicate that you will respond later

        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        }

        queue.delete();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Music stopped in this server, see you next time <✅>`) });

        return await inter.editReply({ embeds: [embed] });
    }
};
