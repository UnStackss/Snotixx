const { Translate } = require('../process_tools');

// Assicurati di definire `maxVol` in un modo appropriato, ad esempio importandolo da una configurazione o passandolo come parametro.
const maxVol = 100; // Aggiorna questo valore in base alla tua configurazione

module.exports = async ({ inter, queue }) => {
    try {
        if (!queue?.isPlaying()) {
            return await inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
        }

        let vol = Math.floor(queue.node.volume + 5);
        if (vol > maxVol) vol = maxVol; // Assicurati che il volume non superi il massimo

        if (queue.node.volume === vol) {
            return await inter.editReply({ content: await Translate(`The volume is already set to <${vol}/${maxVol}%> <${inter.member}>... try again ? <❌>`) });
        }

        const success = queue.node.setVolume(vol);

        return await inter.editReply({ content: success ? await Translate(`The volume has been increased to <${vol}/${maxVol}% 🔊>`) : await Translate(`Something went wrong <${inter.member}>... try again ? <❌>`) });

    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!inter.replied) await inter.deferReply();
        await inter.editReply({ content: await Translate(`There was an error processing your request. Please try again later. <❌>`) });
    }
};
