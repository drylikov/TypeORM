# FAQ and best practices

* [How to do validation?](#how-to-do-validation)
* [What does "owner side" in relations mean or why we need to put `@JoinColumn` and `@JoinTable` decorators?](#what-does-owner-side-in-relations-mean-or-why-we-need-to-put-joincolumn-and-jointable-decorators)
* [How to handle outDir TypeScript compiler option?](#how-to-handle-outdir-typescript-compiler-option)
* [How to use TypeORM with ts-node?](#how-to-use-typeorm-with-ts-node)


## How to do validation?

Validation is not part of TypeORM because validation is a separate process
don't really related to what ORM does.
If you want to use validation use [class-validator](https://github.com/pleerock/class-validator) library - it works perfectly with TypeORM.

## What does "owner side" in relations mean or why we need to put `@JoinColumn` and `@JoinTable` decorators?

Let's start with `one-to-one` relation.
Let's say we have two entities: `User` and `Photo`:

```typescript
@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @OneToOne()
    photo: Photo;
    
}
```

```typescript
@Entity()
export class Photo {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    url: string;
    
    @OneToOne()
    user: User;
    
}
```

This example does not have `@JoinColumn` decorator which is not correct.
Why? Because to make a real relation we need to create a column in the database.
We need to create a column `userId` in `photo` table or `photoId` in `user` table.
But which exactly column should be created - `userId` or `photoId`?
ORM cannot decide it for you. 
To make a decision you must `@JoinColumn` decorator on one of the side.
If you put `@JoinColumn` in `Photo` entity then `userId` column will be created in `photo` table.
If you put `@JoinColumn` in `User` entity then `photoId` column will be created in `user` table.
Where you put `@JoinColumn` decorator that side will be called "owner side of the relationship".
Other side of relation, without `@JoinColumn` decorator is called "inverse (non-owner) side of relationship".

Same in `@ManyToMany` relation you use `@JoinTable` decorator to show owner side of relation.

In `@ManyToOne` or `@OneToMany` relations `@JoinColumn` decorator is not necessary because 
both decorators are different and where you put `@ManyToOne` decorator that table will have relational column. 

`@JoinColumn` and `@JoinTable` decorators are also can be used to specify additional
join column / junction table settings, like join column name or junction table name. 

## How to handle outDir TypeScript compiler option?

When you are using `outDir` compiler option don't forget to copy into output directory assets and resources your app is using.
Or make sure to setup correct paths to those assets.

One thing important to know is when you remove or move entities old entities left unremoved inside ouput directory.
For example you create `Post` entity and renamed it to `Blog`.
You don't have `Post.ts` file in your project, however `Post.js` file is left inside output directory.
Now when TypeORM reads entities from your output directory it sees two entities - both `Post` and `Blog`.
This may be  a source of bugs. 
That's why when you remove and move entities with `outDir` enabled its strongly recommended to remove your output directory and recompile the project again. 

## How to use TypeORM with ts-node?

You can prevent compiling files each time using [ts-node](https://github.com/TypeStrong/ts-node).
If you are using ts-node you can specify `ts` entities inside your connection options:

```
{
    entities: "src/entity/*.ts",
    subscribers: "src/subscriber/*.ts"
}
```

Also if you want to use CLI via ts-node you can execute typeorm following way:

```
ts-node ./node_modules/bin/typeorm schema:sync
```