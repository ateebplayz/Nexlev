import { APIEmbed } from "discord.js";

export function getJobEmbed(job_title: string, job_desc: string, job_budget: string, job_ref: string, job_deadline: string, job_client_tag: string, job_avatar_uri: string | null, job_id:string, deletion?: boolean): APIEmbed {
  return {
      title: `<:title:1241292941117493278> ${job_title}`,
      description: `<:Gap:1239281994245083217>\n<:description:1241292933056167936> **Description**\n<:angle:1241292943818493962> ${job_desc}\n<:Gap:1239281994245083217>`,
      color: deletion ? 0xff1111 : 0x1b9ee6,
      fields: [
        {
          name: '<:budget:1241292938248458240> **Budget**',
          value: `<:angle:1241292943818493962> ${job_budget}`,
          inline: true
        },
        {
          name: '<:title:1241292941117493278> **Client**',
          value: `<:angle:1241292943818493962> ${job_client_tag}\n<:Gap:1239281994245083217>`,
          inline: true
        },
        {
          name: '‎',
          value: '‎',
          inline: true
        },
        {
          name: '<:deadline:1241292935815888917> **Deadline**',
          value: `<:angle:1241292943818493962> ${job_deadline}`,
          inline: true
        },
        {
          name: '<:budget:1241292938248458240> **Reference Example**',
          value: `<:angle:1241292943818493962> ${job_ref}`,
          inline: true
        },
        {
          name: '‎',
          value: '‎',
          inline: true
        },
      ],
      thumbnail: {
        url: job_avatar_uri || ''
      },
      footer: {
          text: `POST ID : ${job_id}`,
          icon_url: `https://i.imgur.com/rCcyC7o.png`
      }
    }
}

export function getAdEmbed(ad_title: string, ad_description: string, ad_budget: string, ad_deadline: string, ad_avatar_url: string | null, ad_id: string): APIEmbed {
  return {
      title: `<:title:1241292941117493278> ${ad_title}`,
      description: `<:Gap:1239281994245083217>\n<:description:1241292933056167936> **Description**\n<:angle:1241292943818493962> ${ad_description}\n<:Gap:1239281994245083217>`,
      color: 0x1b9ee6,
      fields: [
        {
          name: '<:budget:1241292938248458240> **Portfolio**',
          value: `<:angle:1241292943818493962> ${ad_budget}`,
          inline: true
        },
        {
          name: '<:title:1241292941117493278> **Payment Method**',
          value: `<:angle:1241292943818493962> ${ad_deadline}\n<:Gap:1239281994245083217>`,
          inline: true
        },
      ],
      thumbnail: {
        url: ad_avatar_url || ''
      },
      footer: {
          text: `POST ID : ${ad_id}`,
          icon_url: `https://i.imgur.com/rCcyC7o.png`
      }
    }
}
export function getAdEmbedCat(ad_title: string, ad_description: string, ad_budget: string, ad_deadline: string, ad_avatar_url: string | null, ad_id: string, job_category: string): APIEmbed {
  return {
      title: `<:title:1241292941117493278> ${ad_title}`,
      description: `<:Gap:1239281994245083217>\n<:description:1241292933056167936> **Description**\n<:angle:1241292943818493962> ${ad_description}\n<:Gap:1239281994245083217>`,
      color: 0x1b9ee6,
      fields: [
        {
          name: '<:budget:1241292938248458240> **Portfolio**',
          value: `<:angle:1241292943818493962> ${ad_budget}`,
          inline: true
        },
        {
          name: '<:title:1241292941117493278> **Payment Method**',
          value: `<:angle:1241292943818493962> ${ad_deadline}\n<:Gap:1239281994245083217>`,
          inline: true
        },
        {
          name: '<:title:1241292941117493278> **Job Type**',
          value: `<:angle:1241292943818493962> ${job_category}\n<:Gap:1239281994245083217>`,
          inline: false
        },
      ],
      thumbnail: {
        url: ad_avatar_url || ''
      },
      footer: {
          text: `POST ID : ${ad_id}`,
          icon_url: `https://i.imgur.com/rCcyC7o.png`
      }
    }
}

export function generateRandomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';

  // Function to get a random character from the characters set
  function getRandomCharacter() {
      return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Generate the first 4 characters
  for (let i = 0; i < 4; i++) {
      result += getRandomCharacter();
  }

  // Add the hyphen
  result += '-';

  // Generate the next 4 characters
  for (let i = 0; i < 4; i++) {
      result += getRandomCharacter();
  }

  return result;
}