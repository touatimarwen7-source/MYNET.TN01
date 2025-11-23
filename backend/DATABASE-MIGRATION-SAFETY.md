# 🔒 Database Migration Safety Guide

## Safe Migration Process

### ✅ DO: Use Drizzle with db:push

```bash
# Safe migration (recommended)
npm run db:push

# If data loss warning: carefully review then force
npm run db:push --force
```

### ❌ DO NOT: Manual SQL Migrations

Never write raw SQL migrations like:
```sql
ALTER TABLE users DROP COLUMN old_field;
```

### Safe Pattern

1. **Update `shared/schema.ts`** with Drizzle schema changes
2. **Run `npm run db:push`** to sync automatically
3. **Drizzle handles backups and rollback internally**

### Rollback Strategy

If something goes wrong:

1. **Check backups**: System creates daily backups
2. **Review schema**: Compare Drizzle schema with database
3. **Reset if needed**: Drop problematic tables and rerun db:push

### Testing Migrations

Before production:
1. Test on development database
2. Verify schema changes with `npm run db:push`
3. Check data integrity
4. Then apply to production

### Critical Rules

✅ **Always update schema.ts first**
✅ **Always use db:push (never manual SQL)**
✅ **Always have backups**
✅ **Always test first**

❌ **Never write SQL migrations manually**
❌ **Never alter ID column types**
❌ **Never delete tables without backup**

