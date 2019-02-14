public class Demo {
    public static void main(String[] args) {

     /*   for (int i = 1; i <= 9; i++) {
            System.out.println(" ");
            for (int j = 1; j <=i; j++) {
                System.out.print(j+"*"+i+"="+i*j +"  ");
            }
        }*/

        for (int i = 0; i <=5; i++) {
            System.out.println( );
            for (int j = 0; j <=i; j++) {
                for (int k = 0; k < j; k++) {
                    System.out.print("*  ");
                }

            }
            System.out.println( );
        }





    }
}
