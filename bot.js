require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = '1449775322580123648';
const GUILD_ID = '1449765717942472868';

let startTime = Date.now();
const warnings = new Map(); // In-memory storage for warnings

const commands = [
  // Moderation Commands
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Remove a user from the server.')
    .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for kicking').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user permanently.')
    .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for banning').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily mute a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to mute').setRequired(true))
    .addIntegerOption(option => option.setName('time').setDescription('Mute duration in minutes').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove mute role from a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Record a warning for a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check the number of warnings a user has.')
    .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(true)),

  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete the last X messages in a channel.')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change a member’s nickname.')
    .addUserOption(option => option.setName('user').setDescription('The user to nickname').setRequired(true))
    .addStringOption(option => option.setName('nickname').setDescription('New nickname').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  new SlashCommandBuilder()
    .setName('roleadd')
    .setDescription('Assign a role to a member.')
    .addUserOption(option => option.setName('user').setDescription('The user to assign role').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to assign').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  new SlashCommandBuilder()
    .setName('roleremove')
    .setDescription('Remove a role from a member.')
    .addUserOption(option => option.setName('user').setDescription('The user to remove role from').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel (no sending messages).')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to lock').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a previously locked channel.')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to unlock').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode duration in a channel.')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set slowmode').setRequired(true))
    .addIntegerOption(option => option.setName('time').setDescription('Slowmode time in seconds').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement message to a channel.')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to announce in').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The announcement message').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  // Utility Commands
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Show bot latency.'),

  new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Show bot uptime.'),

  new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Show bot version, total commands, uptime.'),

  new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show server stats: members, roles, channels.'),

  new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display information about a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to get info about').setRequired(false)),

  new SlashCommandBuilder()
    .setName('roles')
    .setDescription('List the roles of a user.')
    .addUserOption(option => option.setName('user').setDescription('The user to list roles for').setRequired(false)),

  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show a user’s avatar.')
    .addUserOption(option => option.setName('user').setDescription('The user to show avatar for').setRequired(false)),

  new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Show channel information.')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to get info about').setRequired(false)),

  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Return a link to invite the bot.'),

  new SlashCommandBuilder()
    .setName('randommember')
    .setDescription('Pick a random member from the server.'),

  new SlashCommandBuilder()
    .setName('countroles')
    .setDescription('Count members per role.'),

  new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Create a simple reaction-based poll.')
    .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption(option => option.setName('options').setDescription('Poll options separated by commas').setRequired(true)),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot repeats a message in a channel.')
    .addStringOption(option => option.setName('message').setDescription('The message to repeat').setRequired(true)),

  new SlashCommandBuilder()
    .setName('serverbanner')
    .setDescription('Show the server banner if available.'),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands.map(cmd => cmd.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const member = interaction.member;
  const guild = interaction.guild;

  // Check for Race Control role for moderation commands
  const moderationCommands = ['kick', 'ban', 'mute', 'unmute', 'warn', 'warnings', 'purge', 'nick', 'roleadd', 'roleremove', 'lock', 'unlock', 'slowmode', 'announce'];
  if (moderationCommands.includes(commandName)) {
    const raceControlRole = guild.roles.cache.find(role => role.name === 'Race Control');
    if (!raceControlRole || !member.roles.cache.has(raceControlRole.id)) {
      return interaction.reply({ content: 'You do not have the Race Control role to use this command.', ephemeral: true });
    }
  }

  try {
    switch (commandName) {
      case 'kick':
        const kickUser = interaction.options.getUser('user');
        const kickReason = interaction.options.getString('reason') || 'No reason provided';
        const kickMember = await guild.members.fetch(kickUser.id);
        await kickMember.kick(kickReason);
        await interaction.reply(`Kicked ${kickUser.tag} for: ${kickReason}`);
        break;

      case 'ban':
        const banUser = interaction.options.getUser('user');
        const banReason = interaction.options.getString('reason') || 'No reason provided';
        await guild.members.ban(banUser, { reason: banReason });
        await interaction.reply(`Banned ${banUser.tag} for: ${banReason}`);
        break;

      case 'mute':
        const muteUser = interaction.options.getUser('user');
        const muteTime = interaction.options.getInteger('time');
        const muteMember = await guild.members.fetch(muteUser.id);
        const muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) return interaction.reply('Muted role not found. Please create a role named "Muted".');
        await muteMember.roles.add(muteRole);
        setTimeout(async () => {
          await muteMember.roles.remove(muteRole);
        }, muteTime * 60000);
        await interaction.reply(`Muted ${muteUser.tag} for ${muteTime} minutes.`);
        break;

      case 'unmute':
        const unmuteUser = interaction.options.getUser('user');
        const unmuteMember = await guild.members.fetch(unmuteUser.id);
        const unmuteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (!unmuteRole) return interaction.reply('Muted role not found.');
        await unmuteMember.roles.remove(unmuteRole);
        await interaction.reply(`Unmuted ${unmuteUser.tag}.`);
        break;

      case 'warn':
        const warnUser = interaction.options.getUser('user');
        const warnReason = interaction.options.getString('reason') || 'No reason provided';
        const userWarnings = warnings.get(warnUser.id) || [];
        userWarnings.push({ reason: warnReason, date: new Date() });
        warnings.set(warnUser.id, userWarnings);
        await interaction.reply(`Warned ${warnUser.tag} for: ${warnReason}`);
        break;

      case 'warnings':
        const warningsUser = interaction.options.getUser('user');
        const userWarns = warnings.get(warningsUser.id) || [];
        const embed = new EmbedBuilder()
          .setTitle(`Warnings for ${warningsUser.tag}`)
          .setDescription(userWarns.length ? userWarns.map((w, i) => `${i+1}. ${w.reason} (${w.date.toDateString()})`).join('\n') : 'No warnings.')
          .setColor(0xff0000);
        await interaction.reply({ embeds: [embed] });
        break;

      case 'purge':
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount);
        await interaction.reply(`Deleted ${amount} messages.`);
        break;

      case 'nick':
        const nickUser = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');
        const nickMember = await guild.members.fetch(nickUser.id);
        await nickMember.setNickname(nickname);
        await interaction.reply(`Changed ${nickUser.tag}'s nickname to ${nickname}.`);
        break;

      case 'roleadd':
        const roleAddUser = interaction.options.getUser('user');
        const roleAdd = interaction.options.getRole('role');
        const roleAddMember = await guild.members.fetch(roleAddUser.id);
        await roleAddMember.roles.add(roleAdd);
        await interaction.reply(`Added role ${roleAdd.name} to ${roleAddUser.tag}.`);
        break;

      case 'roleremove':
        const roleRemoveUser = interaction.options.getUser('user');
        const roleRemove = interaction.options.getRole('role');
        const roleRemoveMember = await guild.members.fetch(roleRemoveUser.id);
        await roleRemoveMember.roles.remove(roleRemove);
        await interaction.reply(`Removed role ${roleRemove.name} from ${roleRemoveUser.tag}.`);
        break;

      case 'lock':
        const lockChannel = interaction.options.getChannel('channel');
        await lockChannel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
        await interaction.reply(`Locked ${lockChannel.name}.`);
        break;

      case 'unlock':
        const unlockChannel = interaction.options.getChannel('channel');
        await unlockChannel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null });
        await interaction.reply(`Unlocked ${unlockChannel.name}.`);
        break;

      case 'slowmode':
        const slowChannel = interaction.options.getChannel('channel');
        const slowTime = interaction.options.getInteger('time');
        await slowChannel.setRateLimitPerUser(slowTime);
        await interaction.reply(`Set slowmode in ${slowChannel.name} to ${slowTime} seconds.`);
        break;

      case 'announce':
        const announceChannel = interaction.options.getChannel('channel');
        const announceMessage = interaction.options.getString('message');
        await announceChannel.send(announceMessage);
        await interaction.reply('Announcement sent.');
        break;

      case 'ping':
        const ping = Date.now() - interaction.createdTimestamp;
        await interaction.reply(`Pong! Latency: ${ping}ms`);
        break;

      case 'uptime':
        const uptime = Date.now() - startTime;
        const uptimeString = `${Math.floor(uptime / 86400000)}d ${Math.floor(uptime / 3600000) % 24}h ${Math.floor(uptime / 60000) % 60}m ${Math.floor(uptime / 1000) % 60}s`;
        await interaction.reply(`Uptime: ${uptimeString}`);
        break;

      case 'botinfo':
        const botEmbed = new EmbedBuilder()
          .setTitle('Bot Info')
          .addFields(
            { name: 'Version', value: '1.0.0', inline: true },
            { name: 'Total Commands', value: commands.length.toString(), inline: true },
            { name: 'Uptime', value: `${Math.floor((Date.now() - startTime) / 1000)}s`, inline: true }
          )
          .setColor(0x00ff00);
        await interaction.reply({ embeds: [botEmbed] });
        break;

      case 'serverinfo':
        const serverEmbed = new EmbedBuilder()
          .setTitle(guild.name)
          .addFields(
            { name: 'Members', value: guild.memberCount.toString(), inline: true },
            { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
            { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true }
          )
          .setColor(0x0000ff);
        await interaction.reply({ embeds: [serverEmbed] });
        break;

      case 'userinfo':
        const userInfoUser = interaction.options.getUser('user') || interaction.user;
        const userInfoMember = await guild.members.fetch(userInfoUser.id);
        const userEmbed = new EmbedBuilder()
          .setTitle(userInfoUser.tag)
          .addFields(
            { name: 'ID', value: userInfoUser.id, inline: true },
            { name: 'Joined', value: userInfoMember.joinedAt.toDateString(), inline: true },
            { name: 'Roles', value: userInfoMember.roles.cache.map(r => r.name).join(', ') || 'None', inline: false }
          )
          .setThumbnail(userInfoUser.displayAvatarURL())
          .setColor(0xffff00);
        await interaction.reply({ embeds: [userEmbed] });
        break;

      case 'roles':
        const rolesUser = interaction.options.getUser('user') || interaction.user;
        const rolesMember = await guild.members.fetch(rolesUser.id);
        const rolesList = rolesMember.roles.cache.map(r => r.name).join(', ') || 'None';
        await interaction.reply(`${rolesUser.tag}'s roles: ${rolesList}`);
        break;

      case 'avatar':
        const avatarUser = interaction.options.getUser('user') || interaction.user;
        const avatarEmbed = new EmbedBuilder()
          .setTitle(`${avatarUser.tag}'s Avatar`)
          .setImage(avatarUser.displayAvatarURL({ size: 1024 }))
          .setColor(0xff00ff);
        await interaction.reply({ embeds: [avatarEmbed] });
        break;

      case 'channelinfo':
        const channelInfoChannel = interaction.options.getChannel('channel') || interaction.channel;
        const channelEmbed = new EmbedBuilder()
          .setTitle(channelInfoChannel.name)
          .addFields(
            { name: 'ID', value: channelInfoChannel.id, inline: true },
            { name: 'Type', value: channelInfoChannel.type, inline: true },
            { name: 'Created', value: channelInfoChannel.createdAt.toDateString(), inline: true }
          )
          .setColor(0x00ffff);
        await interaction.reply({ embeds: [channelEmbed] });
        break;

      case 'invite':
        const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;
        await interaction.reply(`Invite link: ${inviteLink}`);
        break;

      case 'randommember':
        const members = await guild.members.fetch();
        const randomMember = members.random();
        await interaction.reply(`Random member: ${randomMember.user.tag}`);
        break;

      case 'countroles':
        const roleCounts = guild.roles.cache.map(role => `${role.name}: ${role.members.size}`);
        await interaction.reply(`Role counts:\n${roleCounts.join('\n')}`);
        break;

      case 'vote':
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');
        const voteEmbed = new EmbedBuilder()
          .setTitle(question)
          .setDescription(options.map((opt, i) => `${i+1}. ${opt.trim()}`).join('\n'))
          .setColor(0x00ff00);
        const row = new ActionRowBuilder()
          .addComponents(
            options.slice(0, 5).map((_, i) => new ButtonBuilder()
              .setCustomId(`vote_${i}`)
              .setLabel(`${i+1}`)
              .setStyle(ButtonStyle.Primary)
            )
          );
        await interaction.reply({ embeds: [voteEmbed], components: [row] });
        break;

      case 'say':
        const sayMessage = interaction.options.getString('message');
        await interaction.reply(sayMessage);
        break;

      case 'serverbanner':
        const bannerURL = guild.bannerURL();
        if (bannerURL) {
          const bannerEmbed = new EmbedBuilder()
            .setTitle('Server Banner')
            .setImage(bannerURL)
            .setColor(0xffa500);
          await interaction.reply({ embeds: [bannerEmbed] });
        } else {
          await interaction.reply('No server banner set.');
        }
        break;

      default:
        await interaction.reply('Unknown command.');
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
});

client.login(TOKEN);
