import { saveAs } from 'file-saver'
import { HTMLAttributes, ReactNode } from 'react'

interface DataItem {
    [key: string]: string | number | boolean | object | null | undefined
}

const convertToCSV = (data: DataItem[]): string => {
    if (!data.length) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(',')).join('\n')

    return `${headers}\n${rows}`
}

const downloadCSV = (data: DataItem[], filename: string = 'data.csv'): void => {
    const csvContent = convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, filename)
}

interface DownloadCSVProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    filename?: string
    data: DataItem[]
    children?: ReactNode
}

export default function DownloadCSV({ children, data, filename, ...divProps }: DownloadCSVProps) {
    return (
        <div {...divProps} onClick={() => downloadCSV(data, filename)}>
            {children}
        </div>
    )
}
