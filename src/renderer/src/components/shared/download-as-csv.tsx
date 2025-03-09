import { saveAs } from 'file-saver'

interface DataItem {
    [key: string]: string | number | boolean | object | null | undefined
}

const convertToCSV = (data: DataItem[]): string => {
    if (!data.length) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) => Object.values(row).join(',')).join('\n')

    return `${headers}\n${rows}`
}

const downloadCSV = (data: DataItem[], filename: string = 'data.csv'): void => {
    const csvContent = convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, filename)
}

interface DownloadCSVProps {
    filename?: string
    data: DataItem[]
}

export default function DownloadCSV({ data, filename }: DownloadCSVProps) {
    return <div onClick={() => downloadCSV(data, filename)}>Export CSV</div>
}
