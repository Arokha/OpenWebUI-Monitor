/**
 * Resolves a model's parent ("base") model id.
 *
 * Open WebUI reports the parent directly in `info.base_model_id` for models
 * created under Workspace > Models. Pipe functions instead encode it in the id
 * itself (`my_pipe.gpt-4o`), so we fall back to the dotted suffix -- but only
 * when that suffix names a model that actually exists, otherwise an id which
 * merely contains a dot (`gpt-4.1-custom`) resolves to a parent that was never
 * there ("1-custom").
 *
 * Returns null when the model has no parent, i.e. it is a base model itself.
 */
export function resolveBaseModelId(
    id: string,
    reportedBaseModelId: string | null | undefined,
    knownModelIds: ReadonlySet<string>
): string | null {
    if (reportedBaseModelId) {
        return String(reportedBaseModelId)
    }

    const idParts = String(id).split('.')
    if (idParts.length > 1) {
        const candidate = idParts[idParts.length - 1]
        if (candidate && candidate !== id && knownModelIds.has(candidate)) {
            return candidate
        }
    }

    return null
}
