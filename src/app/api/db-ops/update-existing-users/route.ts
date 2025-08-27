import { prisma } from '@/lib/prisma'
import { HttpStatus } from '@/utils/http-status';
import { NextResponse } from 'next/server';


export async function GET({ }) {

    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Seeding is disabled in production' }, { status: HttpStatus.FORBIDDEN });
    }
    else {
        return NextResponse.json({ message: 'Seeding is disabled as database is filled with actual data.' }, { status: HttpStatus.FORBIDDEN });
    }


    try {
        const result = await prisma.user.updateMany({
            where: {},
            data: {
                profileComplete: true,
            },
        });

        console.log(`updated ${result.count} users.`);
        return NextResponse.json({ updated: result.count }
            , { status: HttpStatus.OK }
        );
    }
    catch (error) {
        console.error('Error updating users:', error);
        return NextResponse.json({ message: error }
            , { status: HttpStatus.INTERNAL_SERVER_ERROR }
        )
    }
}