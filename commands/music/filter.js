const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { AudioFilters, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

const MY_ID = '1131965612890005626'; // Sostituisci con il tuo ID utente
const STORE_URL = 'https://discord.com/application-directory/1270321783349968978/store'; // Sostituisci con l'URL reale del tuo store

module.exports = {
    name: 'filter',
    description: 'Add or remove a filter to your track',
    voiceChannel: true,
    options: [
        {
            name: 'filter',
            description: 'The filter you want to add or remove',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: Object.keys(AudioFilters.filters).slice(0, 25).map(filter => ({ name: filter, value: filter })),
        }
    ],

    async execute({ inter }) {
        if (inter.user.id !== MY_ID) {
            const premiumEmbed = new EmbedBuilder()
                .setTitle('🔒 Access Restricted')
                .setDescription('This command is restricted to specific users. To gain access, consider purchasing **Snotix Premium** for just **2,99€ per month** from our store!')
                .addFields(
                    { name: 'Premium Benefits', value: '• Dashboard\n• Spotify And SoundCloud Support\n• Filters\n• Priority support\n• And more!' },
                    { name: 'Subscribe Now', value: `[Click here to purchase Snotix Premium](${STORE_URL})` }
                )
                .setColor('#ff0000')
                .setFooter({
                    text: 'Visit our store for more details',
                    iconURL: 'https://i.imgur.com/F2S7M7R.gif' // Sostituisci con l'URL dell'icona del tuo store
                });

            return inter.reply({ embeds: [premiumEmbed], ephemeral: true });
        }

        await inter.deferReply(); // Differisci la risposta

        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) {
            return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again? <❌>`) });
        }

        const selectedFilter = inter.options.getString('filter').toLowerCase();
        const currentFilters = queue.filters.ffmpeg.getFiltersEnabled();
        const availableFilters = [...queue.filters.ffmpeg.getFiltersDisabled(), ...currentFilters];
        const filterExists = availableFilters.some(f => f.toLowerCase() === selectedFilter);

        if (!filterExists) {
            let msg = await Translate(`This filter doesn't exist <${inter.member}>... try again? <❌>\n`) +
                      (currentFilters.length ? await Translate(`Current active filters: **${currentFilters.join(', ')}**\n`) : '') +
                      await Translate('List of available filters:');
            availableFilters.forEach(f => msg += `\n- **${f}**`);
            return inter.editReply({ content: msg });
        }

        // Toggle the filter
        await queue.filters.ffmpeg.toggle(selectedFilter);

        const filterEmbed = new EmbedBuilder()
            .setAuthor({ 
                name: await Translate(`The filter **${selectedFilter}** is now **${queue.filters.ffmpeg.isEnabled(selectedFilter) ? 'enabled' : 'disabled'}** <✅>\n*Note: The longer the music, the longer it may take.*`)
            })
            .setColor('#2f3136');

        return inter.editReply({ embeds: [filterEmbed] });
    }
}
