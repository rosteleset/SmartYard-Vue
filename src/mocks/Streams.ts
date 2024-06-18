import {Range, Stream, FormatedRange} from '@/types/camera';

const mockRanges: Range[] = [
    {from: 1622520000, duration: 3600},
    {from: 1622523600, duration: 7200},
    {from: 1622530800, duration: 1800}
];

const mockStreams: Stream[] = [
    {
        stream: 'http://camera1/stream1',
        ranges: [
            {from: 1622520000, duration: 3600},
            {from: 1622523600, duration: 7200}
        ]
    },
    {
        stream: 'http://camera2/stream2',
        ranges: [
            {from: 1622530800, duration: 1800}
        ]
    }
];

const mockFormatedRanges: FormatedRange[] = [
    {
        from: 1622520000,
        duration: 3600,
        date: new Date(1622520000 * 1000),
        streamUrl: 'http://camera1/stream1'
    },
    {
        from: 1622523600,
        duration: 7200,
        date: new Date(1622523600 * 1000),
        streamUrl: 'http://camera1/stream1'
    },
    {
        from: 1622530800,
        duration: 1800,
        date: new Date(1622530800 * 1000),
        streamUrl: 'http://camera2/stream2'
    }
];

export {mockRanges, mockStreams, mockFormatedRanges};
