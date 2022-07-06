# Using CLI

* [Create a new entity](#create-a-new-entity)
* [Create a new subscriber](#create-a-new-subscriber)
* [Create a new migration](#create-a-new-migration)
* [Generate a migration from exist table schema](#generate-a-migration-from-exist-table-schema)
* [Run migrations](#run-migrations)
* [Revert migrations](#revert-migrations)
* [Sync database schema](#sync-database-schema)
* [Log sync database schema queries without actual running them](#log-sync-database-schema-queries-without-actual-running-them)
* [Drop database schema](#drop-database-schema)
* [Run any sql query](#run-any-sql-query)
* Create database backup [TBD]

## Create a new entity

You can create a new entity using CLI:

```
typeorm entity:create -n User
```

where `User` is entity file and class names. 
Running following command will create a new empty entity in `entitiesDir` of the project.
To setup `entitiesDir` of the project you must add it in connection options:

```
{
    cli: {
        entitiesDir: "src/entity"
    }
}
```

More about connection options [see here](./connection-options.md).
If you have multi-module project structure with multiple entities in different directories
you can provide a path to CLI command where you want to generate an entity:

 
```
typeorm entity:create -n User -d src/user/entity
```

More about entities [read here](./entities.md).

## Create a new subscriber

You can create a new subscriber using CLI:

```
typeorm subscriber:create -n UserSubscriber
```

where `UserSubscriber` is subscriber file and class names. 
Running following command will create a new empty subscriber in `subscribersDir` of the project.
To setup `subscribersDir` of the project you must add it in connection options:

```
{
    cli: {
        subscribersDir: "src/subscriber"
    }
}
```

More about connection options [see here](./connection-options.md).
If you have multi-module project structure with multiple subscribers in different directories
you can provide a path to CLI command where you want to generate a subscriber:

 
```
typeorm subscriber:create -n UserSubscriber -d src/user/subscriber
```

More about subscribers [read here](./listeners-and-subscribers.md).

## Create a new migration

You can create a new migration using CLI:

```
typeorm migration:create -n UserSubscriber
```

where `UserSubscriber` is migration file and class names. 
Running following command will create a new empty migration in `migrationsDir` of the project.
To setup `migrationsDir` of the project you must add it in connection options:

```
{
    cli: {
        migrationsDir: "src/migration"
    }
}
```

More about connection options [see here](./connection-options.md).
If you have multi-module project structure with multiple migrations in different directories
you can provide a path to CLI command where you want to generate a migration:

```
typeorm migration:create -n UserMigration -d src/user/migration
```

More about migrations [read here](./migrations.md).

## Generate a migration from exist table schema

Automatic migration generation feature creates a new migration file
and writes there all sql queries schema sync must execute to update a schema.

```
typeorm migration:generate -n UserMigration
```

Rule of thumb is to generate migration after each entity change.

More about migrations [read here](./migrations.md).

## Run migrations

To execute all pending migrations use following command:

```
typeorm migrations:run
```

More about migrations [read here](./migrations.md).

## Revert migrations

To revert last executed migration use following command:

```
typeorm migrations:revert
```

This command will undo only last executed migration.
You can execute this command multiple times to revert on a specific migration run.
More about migrations [read here](./migrations.md).

## Sync database schema

To synchronize a database schema use following command:
```
typeorm schema:sync
```

Be careful running this command on production - 
schema sync may bring you data loose if you don't use it wisely.
Check sql queries it will run before running this query on production.

## Log sync database schema queries without actual running them

To check what sql queries `schema:sync` is going to run use following command:

```
typeorm schema:log
```

## Drop database schema

To complete drop database schema use following command:

```
typeorm schema:drop
```

Be careful with this command on production since it completely remove data from your database.

## Run any sql query

You can execute any sql query you want directly in the database using following command:

```
typeorm query "SELECT * FROM USERS"
```
