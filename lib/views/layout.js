
export default ['render', ({ renderHtml, params }) => renderHtml`
    <!DOCTYPE html>
    <html>
        <head>
            <title>${params.title}</title>
            <script src="/javascripts"></script>
        </head>
        <body>
            ${params.body}
        </body>
    </html>
`];
