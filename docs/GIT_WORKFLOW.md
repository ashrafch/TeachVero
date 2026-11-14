# Workflow Git TeachVero

Repository esistente: https://github.com/ashrafch/TeachVero. Ramo principale: `master` (confermato dal repository). Non rinominare il ramo e non creare un secondo remote.

## Ciclo di lavoro

1. Leggere AGENTS.md, controllare `git status`, ramo e diff. Preservare le modifiche già presenti; distinguere quelle della task da interventi estranei.
2. Aprire un ramo breve da una base verificata: `feat/nome-funzione`, `fix/nome-problema`, `refactor/nome-area`, `docs/nome-documento`, `test/nome-flusso` oppure `ci/nome-controllo`. `release/0.2.0` è riservato alla preparazione di un rilascio e `hotfix/nome-problema` a una correzione urgente. Non occorre un ramo develop per questo progetto individuale.
3. Implementare una porzione completa, verificare il comportamento, aggiornare documentazione e changelog. Non dichiarare superati test non eseguiti.
4. Controllare il diff e aggiungere allo staging solo i file pertinenti. Creare commit locali al termine di ogni porzione verificata; non un commit per ogni salvataggio. Mai commit automatici con `git add .` senza revisione.
5. Aprire una PR in bozza verso `master` quando pubblicazione del ramo e destinazione sono autorizzate. Usare il template e descrivere risultato, test e limiti. Continuare sullo stesso ramo per correzioni della medesima task.
6. Dopo review e CI verdi, effettuare un merge approvato (squash consigliato). Tag e release sono operazioni separate dal commit; non eseguire merge, tag remoto o deploy automaticamente.

## Commit e commenti

Formato: `tipo(ambito): risultato concreto`, in inglese per coerenza con codice e CI. Tipi: feat, fix, refactor, docs, test, chore, ci, perf, build, revert. Esempio: `feat(portal): separate student profile from lesson overview`.

Il corpo del commit spiega il motivo e le verifiche significative. Nella PR descrivere il risultato finale, non il diario della conversazione. Alla fine della task riportare ramo, hash, versione candidata, test e stato della PR. Aggiungere un aggiornamento alla PR quando una revisione cambia materialmente risultato o verifiche; evitare commenti ripetitivi per ogni file.

## Versioni

- `0.MINOR.PATCH` durante il MVP. Nuove capacità complete: minor; correzioni compatibili: patch. Refactoring, test e documentazione possono restare nella stessa candidata.
- La versione cambia per un incremento di prodotto, non a ogni commit. `package.json`, i due campi radice del lockfile e CHANGELOG.md devono concordare.
- Usare `npm.cmd version 0.2.1 --no-git-tag-version` per preparare una versione; aggiungere la relativa voce al changelog.
- La candidata corrente è `0.2.0`, ancora Unreleased. Solo dopo merge, verifica e autorizzazione del rilascio: aggiornare la data, creare un tag annotato `v0.2.0` sull'esatto commit approvato e pubblicare note basate sul changelog. Non creare ora un tag che suggerisca un rilascio completato.

## Comandi di verifica

```powershell
git status --short
git diff --check
npm.cmd run workflow:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:integration
npm.cmd run build
npm.cmd run test:e2e
```

La CI controlla versione, convenzione del ramo e titolo PR, poi esegue controlli statici, test database, build e browser. Le PR eseguono codice con permessi di sola lettura: non usare pull_request_target per eseguire codice della PR e non aggiungere credenziali di produzione ai test.

## Identità, autenticazione e pubblicazione

Usare l'identità del proprietario verificata, senza inventare indirizzi email. I commit esistenti utilizzano l'indirizzo GitHub noreply del proprietario. La connessione GitHub dell'app e l'autenticazione di gh/Git sul PC sono distinte: verificare entrambe prima di dichiarare una PR pubblicata.

Esempio da eseguire solo per una pubblicazione autorizzata:

```powershell
gh auth status
git push --set-upstream origin feat/learning-portal-v0.2.0
gh pr create --draft --base master --head feat/learning-portal-v0.2.0 --title 'feat(portal): deliver the personal learning workspace' --body-file .data/pr-body.md
```

Nessun force-push, reset distruttivo, cancellazione di rami non propri o push su master. File .env, cache, trace, dati reali e log di sessione restano esclusi. Gli screenshot pubblicati devono contenere solo contenuti demo verificati.

Riferimenti verificati: [eventi GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) e [uso sicuro dei workflow](https://docs.github.com/en/actions/reference/security/secure-use).
