const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    try {
        // Assicurati che l'interazione sia stata deferita o inviata
        if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata

        if (!queue?.isPlaying()) {
            return await inter.editReply({
                content: await Translate(`No music currently playing... try again ? <❌>`)
            });
        }

        const resumed = queue.node.resume();
        let message = await Translate(`Current music <${queue.currentTrack.title}> resumed <✅>`);

        if (!resumed) {
            queue.node.pause();
            message = await Translate(`Current music <${queue.currentTrack.title}> paused <✅>`);
        }

        return await inter.editReply({
            content: message
        });

    } catch (error) {
        console.error('❌ Error handling interaction:', error);

        // Assicurati che la risposta venga inviata anche in caso di errore
        if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
        return await inter.editReply({
            content: await Translate('There was an error while processing your request. Please try again later. <❌>')
        });
    }
};
