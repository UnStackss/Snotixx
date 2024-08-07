const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  try {
    // Assicurati che l'interazione sia stata deferita o inviata
    if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata

    const methods = ['disabled', 'track', 'queue'];
    const currentRepeatMode = queue.repeatMode;

    if (!queue?.isPlaying()) {
      return await inter.editReply({
        content: await Translate('No music currently playing... try again ? <❌>'),
      });
    }

    // Attiva o disattiva il loop basato sullo stato attuale
    if (currentRepeatMode === QueueRepeatMode.OFF) {
      // Attiva il loop della coda
      queue.setRepeatMode(QueueRepeatMode.TRACK);
      return await inter.editReply({
        content: await Translate('Loop mode has been set to <**track**>.<✅>'),
      });
    } else if (currentRepeatMode === QueueRepeatMode.TRACK) {
      // Disattiva il loop della coda
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      return await inter.editReply({
        content: await Translate('Loop mode has been set to <**queue**>.<✅>'),
      });
    } else {
      // Disattiva il loop della coda
      queue.setRepeatMode(QueueRepeatMode.OFF);
      return await inter.editReply({
        content: await Translate('Loop mode has been set to <**disabled**>.<✅>'),
      });
    }

  } catch (error) {
    console.error('❌ Error handling interaction:', error);

    // Assicurati che la risposta venga inviata anche in caso di errore
    if (!inter.replied) await inter.deferReply(); // Differisci la risposta se non è stata già inviata
    return await inter.editReply({
      content: await Translate('There was an error while processing your request. Please try again later. <❌>'),
    });
  }
};
