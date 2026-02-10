# Tyre Pyrolysis Plant Records Platform

A lightweight web app where plant workers can log:

- Maintenance records
- Operational data
- Safety compliance records
- Environmental compliance records
- Photo evidence uploads

## Run locally

Because this is a static app, you can run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Notes

- Data is stored in browser `localStorage`.
- This is suitable for quick internal prototyping; for production use, add authentication, role-based access, and server-side storage.
