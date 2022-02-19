import { Event } from '../Interfaces';
import { GuildMember } from 'discord.js';
import GuildSchema from '../Utils/Schemas/Guild';
import WelcomeSchema from '../Utils/Schemas/Welcome';
import { CreateBanner } from '../Utils/Helpers/Functions';

export const event: Event = {
  name: 'guildMemberAdd',
  run: async (client, member: GuildMember) => {
    const GuildID = member.guild.id;
    const welcomeData = await WelcomeSchema.findOne({ _id: GuildID });
    if (!welcomeData || !welcomeData.ChannelID || welcomeData.ChannelID == 'None') return;
    const WelcomeChannel = client.channels.cache.get(welcomeData.ChannelID) as any;

    // Checks if the guild has a default role set
    const data = await GuildSchema.findOne({ _id: GuildID });
    if (!data) return;

    // Assigns the default role to the new member
    if (data.DefaultRoleID) {
      const Role = member.guild.roles.cache.get(data.DefaultRoleID);
      if (Role) member.roles.add(Role);
    }

    const AnnouncementType = data.AnnouncementType;
    switch (AnnouncementType) {
      case 'text':
        console.log(`${member.user.tag} has joined the server.`);
        return WelcomeChannel.send({ content: `${member} has joined the server! 🥳` });
      case 'embed':
        console.log('Embed');
      case 'banner':
        const Banner = await CreateBanner(member);
        WelcomeChannel.send({
          files: [Banner],
          content: `${member} has joined the server! 🥳`,
        });
        return;
      default:
        console.log('Invalid announcement type');
        break;
    }
  },
};
