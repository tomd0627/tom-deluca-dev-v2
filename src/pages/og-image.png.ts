import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';

const fontsDir = join(process.cwd(), 'node_modules/@fontsource/inter/files');
const font400 = readFileSync(join(fontsDir, 'inter-latin-400-normal.woff'));
const font700 = readFileSync(join(fontsDir, 'inter-latin-700-normal.woff'));

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0b1622',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                padding: '60px 80px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '6px',
                      alignSelf: 'stretch',
                      backgroundColor: '#5ef0c8',
                      borderRadius: '3px',
                      marginRight: '48px',
                      flexShrink: 0,
                    },
                    children: '',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '80px',
                            fontWeight: 700,
                            color: '#e8f1ff',
                            lineHeight: 1.1,
                            letterSpacing: '-2px',
                          },
                          children: 'Tom DeLuca',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '36px',
                            fontWeight: 400,
                            color: '#5ef0c8',
                            marginTop: '16px',
                          },
                          children: 'Senior Front-End Developer',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '24px',
                            fontWeight: 400,
                            color: '#94a3b8',
                            marginTop: '8px',
                          },
                          children: 'Warwick, New York',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 400,
                            color: '#a78bfa',
                            marginTop: '36px',
                          },
                          children: 'tomdeluca.dev',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                height: '8px',
                backgroundColor: '#5ef0c8',
              },
              children: '',
            },
          },
        ],
      },
      // biome-ignore lint/suspicious/noExplicitAny: satori types require ReactNode but accepts plain element objects at runtime
    } as any,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: font400, weight: 400, style: 'normal' },
        { name: 'Inter', data: font700, weight: 700, style: 'normal' },
      ],
    }
  );

  const png = new Uint8Array(new Resvg(svg).render().asPng());

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
