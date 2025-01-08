import { specIcon } from '@renderer/lib/wow-icon'

export const WowSpecIcon = ({ specId, ...props }: { specId: number } & any) => {
    return <img src={specIcon.get(specId)} alt={'Spec' + specId} {...props} />
}
