import {Store, StoreDefinition} from "pinia";
import {Mock} from "vitest";
import {ComputedRef} from "vue";

function mockedStore<TStoreDef extends () => unknown>(
    useStore: TStoreDef
): TStoreDef extends StoreDefinition<
        infer Id,
        infer State,
        infer Getters,
        infer Actions
    >
    ? Store<
    Id,
    State,
    Record<string, never>,
    {
        [K in keyof Actions]: Actions[K] extends (
            ...args: infer Args
        ) => infer ReturnT
        ? // 👇 depends on your testing framework
        Mock<Args, ReturnT>
        : Actions[K]
    }
> & {
    [K in keyof Getters]: Getters[K] extends ComputedRef<infer T> ? T : never
}
    : ReturnType<TStoreDef> {
    return useStore() as any
}

export default mockedStore