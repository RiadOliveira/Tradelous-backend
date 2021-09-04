export default interface ICacheProvider {
    save(key: string, value: string): Promise<void>;
    recover<T>(key: string): Promise<T | undefined>;
    invalidate(key: string): Promise<void>;
    invalidatePrefix(prefix: string): Promise<void>;
}
