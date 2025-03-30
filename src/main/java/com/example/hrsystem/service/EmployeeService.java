package com.example.hrsystem.service;

import org.springframework.stereotype.Service;
import com.example.hrsystem.model.Employee;

import java.util.List;
import java.util.Random;

@Service
public class EmployeeService {

    private final List<Employee> employees = List.of(
            new Employee(1L, "Grumpy Cat", "https://i.etsystatic.com/35861969/r/il/3476e0/4207562131/il_794xN.4207562131_tqpz.jpg"),
            new Employee(2L, "Surprised Pikachu", "https://mystickermania.com/cdn/stickers/memes/sticker_2134-512x512.png"),
            new Employee(3L, "SLAYYYYY", "https://example.com/surprised-pikachu.jpg"),
            new Employee(4L, "T D", "https://www.thesprucepets.com/thmb/vTYBysFXE3XXStVeC21dNXk1mYk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-56158469-5c8ba7dc46e0fb0001770031.jpg"),
            new Employee(5L, "O Gj", "https://people.com/thmb/tHi_vITs6zNwzaTTFMp3ojOndFY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(792x404:794x406):format(webp)/baby-giraffe-1-c7f0fe4744394c43b1348d781a87891a.jpg"),
            new Employee(6L, "A Z", "https://mymodernmet.com/wp/wp-content/uploads/2019/12/felted-animals-yulia-derevschikova-16.jpg"),
            new Employee(7L, "E M", "https://mymodernmet.com/wp/wp-content/uploads/2019/12/felted-animals-yulia-derevschikova-13.jpg"),
            new Employee(8L, "Z M", "https://qph.cf2.quoracdn.net/main-qimg-6ccc311fa0a7b0d8987d526a32f58b53"),
            new Employee(9L, "J P", "https://mymodernmet.com/wp/wp-content/uploads/2019/12/felted-animals-yulia-derevschikova-6.jpg"),
            new Employee(10L, "S A", "https://cdn1.tedsby.com/tb/large/storage/1/0/3/1034617/cute-other-baby-penguin-by-cathie-mir.jpg")







    );

    public Employee getRandomEmployee() {
        return employees.get(new Random().nextInt(employees.size()));
    }
}
