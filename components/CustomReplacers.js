export default function (editor) {
    editor.codeBlockManager.setReplacer('credit', content => {
        const lines = content.split("\n");
        var display = '';
        var url = '';

        lines.forEach(line => {
            if (line.startsWith('display: ')) {
                display = line.replace('display: ', '');
            } else if (line.startsWith('url: ')) {
                url = line.replace('url: ', '');
            }
        });

        if (display && url) {
            return `<a href="${url}" target="_blank" style="color: #aaa; font-size: 10pt;">${display}</a>`;
        } else if (display) {
            return `<span style="color: #aaa; font-size: 10pt;">${display}</span>`;
        } else if (url) {
            return `<a href="${url}" target="_blank" style="color: #aaa; font-size: 10pt;">${url}</a>`;
        } 
        return '';
    })
}