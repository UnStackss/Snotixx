const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    try {
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }
        if (queue.tracks.size === 0) {
            return await inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });
        }

        await queue.tracks.shuffle();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Queue shuffled <${queue.tracks.size}> song(s)! <✅>`) });

        return await inter.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply();
        await inter.editReply({ content: await Translate('There was an error processing your request. Please try again later. <❌>') });
    }
};
