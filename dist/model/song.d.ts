import mongoose, { Document } from 'mongoose';
export interface ISong extends Document {
    name: string;
    artist: string;
    title: string;
    link?: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
declare const _default: mongoose.Model<ISong, {}, {}, {}, mongoose.Document<unknown, {}, ISong, {}, {}> & ISong & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=song.d.ts.map