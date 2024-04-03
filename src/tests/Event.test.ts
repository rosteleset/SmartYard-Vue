import {test, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import Event from "@/components/EventsListItem.vue";
import {Event as EventType} from "@/types/events";
import {createTestingPinia} from "@pinia/testing";
import dayjs from "dayjs";

// Подготовка данных для теста
const mockEvent: EventType = {
    date: "2024-03-28 12:00:00",
    timezone: 3, // UTC+3 (Московское время)
    uuid: "12345678-1234-1234-1234-123456789abc",
    image: "87654321-4321-4321-4321-ba9876543210",
    objectId: "1",
    objectType: "0",
    objectMechanizma: "1",
    mechanizmaDescription: "Описание двери",
    event: "1",
    preview: "https://example.com/image.jpg",
    previewType: 0,
    detail: "Непонятная фигня",
    detailX: {
        flags: ["canLike"],
    },
};

const mockTFunction = (s: string) => s;
const pinia = createTestingPinia({createSpy: vi.fn});

vi.mock("@/hooks/useLocale", () => {
    return {
        default: () => ({
            localizedDayjs: {value: dayjs},
            t: mockTFunction
        })
    }
});

test("отображает время события в правильном формате", async () => {
    // Монтируем компонент
    const wrapper = mount(Event, {
        props: {
            event: mockEvent,
        },
        plugins: [pinia],
        global: {
            mocks: {
                $t: mockTFunction,
            },
        },
    });

    // Проверяем, что компонент отображает время события в формате "HH:mm"
    expect(wrapper.find(".event__time").text()).toContain("12:00");
});

