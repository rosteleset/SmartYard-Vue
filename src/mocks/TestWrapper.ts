import {VueWrapper} from "@vue/test-utils";
import {ComponentPublicInstance} from "vue";

type TestWrapper<T> = VueWrapper<ComponentPublicInstance & T>

export default TestWrapper