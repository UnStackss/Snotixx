const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  try {
    // Controlla se la musica è in riproduzione
    if (!queue?.isPlaying()) {
      if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
      return await inter.editReply({
        content: await Translate('No music currently playing... try again ? <❌>'),
      });
    }

    // Controlla se c'è una traccia precedente nella cronologia
    if (!queue.history.previousTrack) {
      if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
      return await inter.editReply({
        content: await Translate(`There was no music played before <${inter.member}>... try again ? <❌>`),
      });
    }

    // Ripristina la traccia precedente
    await queue.history.back();

    if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
    return await inter.editReply({
      content: await Translate('Playing the <**previous**> track <✅>'),
    });

  } catch (error) {
    console.error('❌ Error handling interaction:', error);
    if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
    return await inter.editReply({
      content: await Translate('There was an error while processing your request. Please try again later. <❌>'),
    });
  }
};
