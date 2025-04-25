export interface OverlayCloseEvent<R> {
    type: 'backdropClick' | 'close';
    data: R;
}
