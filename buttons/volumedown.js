const { Translate } = require('../process_tools');

// Assicurati che maxVol venga passato correttamente o definito altrove
const maxVol = 100; // Puoi aggiornare questo valore in base alla tua configurazione

module.exports = async ({ inter, queue }) => {
    try {
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        let vol = Math.floor(queue.node.volume - 5);
        if (vol < 0) vol = 0; // Assicurati che il volume non scenda sotto zero

        if (queue.node.volume === vol) {
            return await inter.editReply({ content: await Translate(`The volume you want to change is already the current one <${inter.member}>... try again ? <❌>`) });
        }

        const success = queue.node.setVolume(vol);
        return await inter.editReply({ content: success ? await Translate(`The volume has been modified to <${vol}/${maxVol}% 🔊>`) : await Translate(`Something went wrong <${inter.member}>... try again ? <❌>`) });

    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply();
        await inter.editReply({ content: await Translate(`There was an error processing your request. Please try again later. <❌>`) });
    }
};
