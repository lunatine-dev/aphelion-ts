interface TempCodePayload {
    createdAt: number;
    [key: string]: any;
}

const tickets = new Map<string, TempCodePayload>();

export const saveTicket = (ticket: string, payload: object) => {
    tickets.set(ticket, { ...payload, createdAt: Date.now() });
};
export const consumeTicket = (ticket: string): TempCodePayload | null => {
    const data = tickets.get(ticket);
    if (!data) return null;

    tickets.delete(ticket);
    return data;
};

setInterval(() => {
    const now = Date.now();
    tickets.forEach((value, key) => {
        if (now - value.createdAt > 60_000) {
            tickets.delete(key);
        }
    });
}, 30_000).unref();
