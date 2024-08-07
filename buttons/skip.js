const { Translate } = require("../process_tools");

module.exports = async ({ inter, queue }) => {
    try {
        // Assicurati che l'interazione sia stata deferita o inviata
        if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata

        if (!queue?.isPlaying()) {
            return await inter.editReply({
                content: await Translate(`No music currently playing... try again ? <❌>`)
            });
        }

        const success = queue.node.skip();
        const message = success 
            ? await Translate(`Current music <${queue.currentTrack.title}> skipped <✅>`)
            : await Translate(`Something went wrong <${inter.member}>... try again ? <❌>`);

        return await inter.editReply({ content: message });

    } catch (error) {
        console.error('❌ Error handling interaction:', error);

        // Assicurati che la risposta venga inviata anche in caso di errore
        if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
        return await inter.editReply({
            content: await Translate('There was an error while processing your request. Please try again later. <❌>')
        });
    }
};
