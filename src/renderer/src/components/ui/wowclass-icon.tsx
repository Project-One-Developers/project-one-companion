import { classIcon } from '@renderer/lib/wow-icon'

export const WowClassIcon = ({
    wowClassName: wowClassName,
    ...props
}: { wowClassName: string } & any) => {
    return <img src={classIcon.get(wowClassName)} alt={`Class ${wowClassName}`} {...props} />
}
