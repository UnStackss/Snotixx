const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    try {
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        // Stop and delete the queue
        await queue.delete();

        // Create the confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Music stopped in this server, see you next time <✅>`) });

        return await inter.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply();
        await inter.editReply({ content: await Translate(`There was an error processing your request. Please try again later. <❌>`) });
    }
};
