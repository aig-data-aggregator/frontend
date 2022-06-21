import { Global } from "@emotion/react"

export default function Fonts() { 
    return (
  <Global
    styles={`
      /* Copied from https://fonts.googleapis.com/css2?family=Anek+Malayalam&family=DM+Mono&display=swap */

      /* malayalam */
@font-face {
  font-family: 'Anek Malayalam';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/anekmalayalam/v2/6qLjKZActRTs_mZAJUZWWkhke0nYa_vC8_Azq3-gP1SReZeOtqQuDVUTUZu-LNXzPQO7.woff2) format('woff2');
  unicode-range: U+0307, U+0323, U+0964-0965, U+0D02-0D7F, U+200C-200D, U+20B9, U+25CC;
}
/* latin-ext */
@font-face {
  font-family: 'Anek Malayalam';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/anekmalayalam/v2/6qLjKZActRTs_mZAJUZWWkhke0nYa_vC8_Azq3-gP1SReZeOtqQuDVUTUZu-LMPzPQO7.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Anek Malayalam';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/anekmalayalam/v2/6qLjKZActRTs_mZAJUZWWkhke0nYa_vC8_Azq3-gP1SReZeOtqQuDVUTUZu-LM3zPQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/dmmono/v10/aFTU7PB1QTsUX8KYthSQBLyM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/dmmono/v10/aFTU7PB1QTsUX8KYthqQBA.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
      `}
  />
)
}