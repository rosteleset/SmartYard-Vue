import {vi} from "vitest";
import {Camera} from "@/types/camera.ts";

export const mockOpenDoor = vi.fn();

export const mockCamera: Camera = {
    id: 1,
    url: 'https://example.com/stream',
    serverType: 'test',
    token: '123'
} as Camera