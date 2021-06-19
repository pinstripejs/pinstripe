
export default async ({ renderHtml, params: { title, body } }) => renderHtml`
    <!DOCTYPE html>
    <html>
        <head>
            <title>${title}</title>
            <script src="/javascripts/pinstripe.js"></script>
        </head>
        <body>
            ${body}
        </body>
    </html>
`;
